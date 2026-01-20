<template>
  <view class="lazy-image-wrapper" :style="wrapperStyle">
    <image
      v-if="shouldLoad"
      :src="loadedSrc"
      :mode="mode"
      :lazy-load="true"
      :class="['lazy-image', { 'lazy-image-loaded': isLoaded, 'lazy-image-error': isError }]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- 占位图 - 使用 uni-icons -->
    <view v-if="!shouldLoad || (!isLoaded && !isError)" class="lazy-image-placeholder">
      <uni-icons type="image" size="40" color="#ccc"></uni-icons>
    </view>
    
    <!-- 错误图 - 使用 uni-icons -->
    <view v-if="isError" class="lazy-image-error-view">
      <uni-icons type="closeempty" size="40" color="#f56c6c"></uni-icons>
      <text class="error-text">加载失败</text>
    </view>
    
    <!-- 加载动画 -->
    <view v-if="showLoading && shouldLoad && !isLoaded && !isError" class="lazy-image-loading">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    // 图片地址
    src: {
      type: String,
      required: true
    },
    // 占位图
    placeholder: {
      type: String,
      default: '/static/placeholder.png'
    },
    // 错误图
    errorImage: {
      type: String,
      default: '/static/error.png'
    },
    // 图片裁剪模式
    mode: {
      type: String,
      default: 'aspectFill'
    },
    // 宽度
    width: {
      type: String,
      default: '100%'
    },
    // 高度
    height: {
      type: String,
      default: 'auto'
    },
    // 圆角
    borderRadius: {
      type: String,
      default: '0'
    },
    // 是否显示加载动画
    showLoading: {
      type: Boolean,
      default: true
    },
    // 预加载偏移量（屏幕高度的倍数）
    preloadOffset: {
      type: Number,
      default: 0.5
    },
    // 加载优先级
    priority: {
      type: String,
      default: 'normal', // high, normal, low
      validator: (value) => ['high', 'normal', 'low'].includes(value)
    }
  },
  data() {
    return {
      shouldLoad: false,
      isLoaded: false,
      isError: false,
      loadedSrc: '',
      placeholderSrc: this.placeholder,
      errorSrc: this.errorImage,
      observer: null
    };
  },
  computed: {
    wrapperStyle() {
      return {
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f5f5f5'
      };
    },
    imageStyle() {
      return {
        width: '100%',
        height: '100%',
        borderRadius: this.borderRadius
      };
    }
  },
  mounted() {
    // 高优先级图片立即加载
    if (this.priority === 'high') {
      this.loadImage();
      return;
    }
    
    // 其他优先级使用懒加载
    this.initLazyLoad();
  },
  beforeUnmount() {
    this.destroyObserver();
  },
  methods: {
    /**
     * 初始化懒加载
     */
    initLazyLoad() {
      // #ifdef H5
      if (typeof IntersectionObserver !== 'undefined') {
        this.initIntersectionObserver();
      } else {
        // 降级方案：直接加载
        this.loadImage();
      }
      // #endif
      
      // #ifndef H5
      // 小程序和 App 直接使用 lazy-load 属性
      this.loadImage();
      // #endif
    },

    /**
     * 初始化 IntersectionObserver (H5)
     */
    initIntersectionObserver() {
      // #ifdef H5
      const options = {
        rootMargin: `${this.preloadOffset * 100}% 0px`,
        threshold: 0.01
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.shouldLoad) {
            this.loadImage();
            this.destroyObserver();
          }
        });
      }, options);

      // 观察当前元素
      this.$nextTick(() => {
        const element = this.$el;
        if (element) {
          this.observer.observe(element);
        }
      });
      // #endif
    },

    /**
     * 加载图片
     */
    loadImage() {
      if (this.shouldLoad) return;
      
      this.shouldLoad = true;
      this.loadedSrc = this.src;
      
      // 记录加载开始时间
      this.loadStartTime = Date.now();
    },

    /**
     * 图片加载成功
     */
    handleLoad(e) {
      this.isLoaded = true;
      this.isError = false;
      
      // 记录加载时间
      const loadTime = Date.now() - this.loadStartTime;
      console.log(`[LazyImage] Image loaded in ${loadTime}ms:`, this.src);
      
      this.$emit('load', e);
    },

    /**
     * 图片加载失败
     */
    handleError(e) {
      this.isError = true;
      this.isLoaded = false;
      
      console.error('[LazyImage] Image load failed:', this.src);
      
      this.$emit('error', e);
    },

    /**
     * 销毁观察器
     */
    destroyObserver() {
      // #ifdef H5
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.lazy-image-wrapper {
  display: inline-block;
  position: relative;
}

.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  
  &.lazy-image-loaded {
    opacity: 1;
  }
  
  &.lazy-image-error {
    opacity: 0.5;
  }
}

.lazy-image-placeholder,
.lazy-image-error-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.lazy-image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #2979ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
