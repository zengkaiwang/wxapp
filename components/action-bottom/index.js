// components/action-bottom/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    close: false,
    animationData: null
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      // this.setData({
      //   close: true
      // })
      setTimeout(() => {
        this.triggerEvent('close')
      }, 180);
      const animation = wx.createAnimation({
        duration: 250,
        timingFunction: 'ease',
      })
      animation.translateY(500).step()
      this.setData({
        animationData: animation.export()
      })
    },
    loadMore() {
      this.triggerEvent('load-more')
    }
  }
})