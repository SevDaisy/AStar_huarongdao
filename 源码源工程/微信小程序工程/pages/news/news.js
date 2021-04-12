var app = getApp()  
Page({  
  data: {  
    movies:[  
    {url:'/images/l1.jpg'} ,  
    {url:'/images/l2.jpg'} , 
    {url:'/images/l3.jpg'} ,  
    {url:'/images/l4.jpg'} ,
    ]  
  },  
  onLoad: function () {  
  } ,
  
toOut:()=>{
  wx.navigateTo({
     url: '/pages/out/out',
  })
}  
})  
