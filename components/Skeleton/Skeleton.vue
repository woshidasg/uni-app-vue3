<template>
  <view v-if="loading" class="skeleton-wrapper" :class="{ 'skeleton-animated': animated }">
    <!-- 头像骨架 -->
    <view v-if="avatar" class="skeleton-avatar" :class="avatarClass" :style="avatarStyle"></view>
    
    <!-- 标题骨架 -->
    <view v-if="title" class="skeleton-title" :style="titleStyle"></view>
    
    <!-- 段落骨架 -->
    <view v-if="rows > 0" class="skeleton-paragraph">
      <view
        v-for="(row, index) in rows"
        :key="index"
        class="skeleton-row"
        :style="getRowStyle(index)"
      ></view>
    </view>
    
    <!-- 自定义骨架 -->
    <slot name="skeleton"></slot>
  </view>
  
  <!-- 实际内容 -->
  <view v-else class="skeleton-content">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    // 是否显示骨架屏
    loading: {
      type: Boolean,
      default: true
    },
    // 是否显示动画
    animated: {
      type: Boolean,
      default: true
    },
    // 是否显示头像
    avatar: {
      type: Boolean,
      default: false
    },
    // 头像形状：circle, square
    avatarShape: {
      type: String,
      default: 'circle',
      validator: (value) => ['circle', 'square'].includes(value)
    },
    // 头像大小
    avatarSize: {
      type: String,
      default: '40px'
    },
    // 是否显示标题
    title: {
      type: Boolean,
      default: true
    },
    // 标题宽度
    titleWidth: {
      type: String,
      default: '40%'
    },
    // 段落行数
    rows: {
      type: Number,
      default: 3
    },
    // 段落行高
    rowHeight: {
      type: String,
      default: '16px'
    },
    // 最后一行宽度
    lastRowWidth: {
      type: String,
      default: '60%'
    }
  },
  computed: {
    avatarClass() {
      return `skeleton-avatar-${this.avatarShape}`;
    },
    avatarStyle() {
      return {
        width: this.avatarSize,
        height: this.avatarSize
      };
    },
    titleStyle() {
      return {
        width: this.titleWidth,
        height: this.rowHeight
      };
    }
  },
  methods: {
    getRowStyle(index) {
      const isLastRow = index === this.rows - 1;
      return {
        width: isLastRow ? this.lastRowWidth : '100%',
        height: this.rowHeight,
        marginTop: index === 0 ? '0' : '12px'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.skeleton-wrapper {
  padding: 16px;
  
  &.skeleton-animated {
    .skeleton-avatar,
    .skeleton-title,
    .skeleton-row {
      position: relative;
      overflow: hidden;
      background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }
  }
  
  &:not(.skeleton-animated) {
    .skeleton-avatar,
    .skeleton-title,
    .skeleton-row {
      background-color: #f2f2f2;
    }
  }
}

.skeleton-avatar {
  margin-bottom: 16px;
  
  &.skeleton-avatar-circle {
    border-radius: 50%;
  }
  
  &.skeleton-avatar-square {
    border-radius: 4px;
  }
}

.skeleton-title {
  border-radius: 4px;
  margin-bottom: 16px;
}

.skeleton-paragraph {
  .skeleton-row {
    border-radius: 4px;
  }
}

.skeleton-content {
  animation: skeleton-fade-in 0.3s ease-in;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

@keyframes skeleton-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
