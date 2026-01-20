<template>
  <scroll-view
    class="virtual-list"
    :scroll-y="true"
    :style="{ height: containerHeight }"
    :scroll-top="scrollTop"
    :scroll-with-animation="false"
    @scroll="handleScroll"
    @scrolltolower="handleScrollToLower"
  >
    <!-- 占位容器，撑开滚动高度 -->
    <view :style="{ height: totalHeight + 'px' }">
      <!-- 渲染区域 -->
      <view
        class="virtual-list-content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <view
          v-for="item in visibleData"
          :key="getItemKey(item)"
          class="virtual-list-item"
          :style="itemStyle"
        >
          <slot :item="item" :index="item.__index"></slot>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="loading" class="virtual-list-loading">
      <text>{{ loadingText }}</text>
    </view>

    <!-- 没有更多 -->
    <view v-if="noMore && !loading" class="virtual-list-no-more">
      <text>{{ noMoreText }}</text>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'VirtualList',
  props: {
    // 列表数据
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    // 列表项高度（固定高度模式）
    itemHeight: {
      type: Number,
      default: 100
    },
    // 容器高度
    containerHeight: {
      type: String,
      default: '100vh'
    },
    // 缓冲区大小（上下各渲染多少个额外项）
    bufferSize: {
      type: Number,
      default: 5
    },
    // 唯一键名
    keyName: {
      type: String,
      default: 'id'
    },
    // 是否正在加载
    loading: {
      type: Boolean,
      default: false
    },
    // 是否没有更多数据
    noMore: {
      type: Boolean,
      default: false
    },
    // 加载文本
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // 没有更多文本
    noMoreText: {
      type: String,
      default: '没有更多了'
    },
    // 是否启用虚拟滚动（数据量小时可关闭）
    virtual: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      scrollTop: 0,
      startIndex: 0,
      endIndex: 0,
      visibleCount: 0,
      containerHeightPx: 0
    };
  },
  computed: {
    // 总高度
    totalHeight() {
      return this.data.length * this.itemHeight;
    },

    // 偏移量
    offsetY() {
      return this.startIndex * this.itemHeight;
    },

    // 可见数据
    visibleData() {
      if (!this.virtual || this.data.length < 50) {
        // 数据量小时不使用虚拟滚动
        return this.data.map((item, index) => ({
          ...item,
          __index: index
        }));
      }

      return this.data
        .slice(this.startIndex, this.endIndex)
        .map((item, index) => ({
          ...item,
          __index: this.startIndex + index
        }));
    },

    // 列表项样式
    itemStyle() {
      return {
        height: this.itemHeight + 'px',
        boxSizing: 'border-box'
      };
    }
  },
  watch: {
    data: {
      handler() {
        this.calculateVisibleRange();
      },
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.getContainerHeight();
      this.calculateVisibleRange();
    },

    /**
     * 获取容器高度
     */
    getContainerHeight() {
      // 解析容器高度
      const height = this.containerHeight;
      if (height.includes('vh')) {
        const vh = parseFloat(height);
        const systemInfo = uni.getSystemInfoSync();
        this.containerHeightPx = (systemInfo.windowHeight * vh) / 100;
      } else if (height.includes('px')) {
        this.containerHeightPx = parseFloat(height);
      } else {
        this.containerHeightPx = 600; // 默认高度
      }

      // 计算可见数量
      this.visibleCount = Math.ceil(this.containerHeightPx / this.itemHeight);
    },

    /**
     * 计算可见范围
     */
    calculateVisibleRange() {
      if (!this.virtual || this.data.length < 50) {
        this.startIndex = 0;
        this.endIndex = this.data.length;
        return;
      }

      // 计算开始索引
      this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
      this.startIndex = Math.max(0, this.startIndex - this.bufferSize);

      // 计算结束索引
      this.endIndex = this.startIndex + this.visibleCount + this.bufferSize * 2;
      this.endIndex = Math.min(this.data.length, this.endIndex);
    },

    /**
     * 滚动事件处理
     */
    handleScroll(e) {
      this.scrollTop = e.detail.scrollTop;
      this.calculateVisibleRange();
      this.$emit('scroll', e);
    },

    /**
     * 滚动到底部
     */
    handleScrollToLower() {
      if (!this.loading && !this.noMore) {
        this.$emit('loadmore');
      }
    },

    /**
     * 获取列表项的唯一键
     */
    getItemKey(item) {
      return item[this.keyName] || item.__index;
    },

    /**
     * 滚动到指定索引
     */
    scrollToIndex(index) {
      const scrollTop = index * this.itemHeight;
      this.scrollTop = scrollTop;
    },

    /**
     * 滚动到顶部
     */
    scrollToTop() {
      this.scrollToIndex(0);
    },

    /**
     * 刷新列表
     */
    refresh() {
      this.scrollTop = 0;
      this.calculateVisibleRange();
    }
  }
};
</script>

<style lang="scss" scoped>
.virtual-list {
  position: relative;
  overflow: hidden;
}

.virtual-list-content {
  will-change: transform;
}

.virtual-list-item {
  width: 100%;
  overflow: hidden;
}

.virtual-list-loading,
.virtual-list-no-more {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
