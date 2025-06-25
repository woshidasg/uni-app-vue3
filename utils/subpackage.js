/**
 * 分包工具函数
 */

// 分包路径映射
const SUB_PACKAGES = {
  my: 'sub-pages/my'
};

/**
 * 获取分包资源路径
 * @param {String} packageName 分包名称
 * @param {String} resourcePath 资源相对路径
 * @returns {String} 完整资源路径
 */
export function getSubpackageResourcePath(packageName, resourcePath) {
  if (!SUB_PACKAGES[packageName]) {
    console.warn(`分包 ${packageName} 不存在`);
    return resourcePath;
  }
  
  // 移除开头的斜杠
  const path = resourcePath.startsWith('/') ? resourcePath.substring(1) : resourcePath;
  return `/${SUB_PACKAGES[packageName]}/${path}`;
}

/**
 * 检查页面是否在分包中
 * @param {String} pagePath 页面路径
 * @returns {Boolean}
 */
export function isInSubpackage(pagePath) {
  // 移除开头的斜杠
  const path = pagePath.startsWith('/') ? pagePath.substring(1) : pagePath;
  
  // 检查是否以任一分包路径开头
  return Object.values(SUB_PACKAGES).some(subPath => 
    path.startsWith(subPath)
  );
}

/**
 * 获取页面所属的分包名称
 * @param {String} pagePath 页面路径
 * @returns {String|null} 分包名称，不在分包中则返回null
 */
export function getSubpackageName(pagePath) {
  // 移除开头的斜杠
  const path = pagePath.startsWith('/') ? pagePath.substring(1) : pagePath;
  
  for (const [name, subPath] of Object.entries(SUB_PACKAGES)) {
    if (path.startsWith(subPath)) {
      return name;
    }
  }
  
  return null;
}

/**
 * 预加载分包
 * @param {String|Array} packageNames 分包名称或名称数组
 */
export function preloadSubpackage(packageNames) {
  const names = Array.isArray(packageNames) ? packageNames : [packageNames];
  
  names.forEach(name => {
    if (!SUB_PACKAGES[name]) {
      console.warn(`分包 ${name} 不存在，无法预加载`);
      return;
    }
    
    uni.preloadSubpackage({
      name: name,
      success: () => {
        console.log(`分包 ${name} 预加载成功`);
      },
      fail: (err) => {
        console.error(`分包 ${name} 预加载失败:`, err);
      }
    });
  });
} 