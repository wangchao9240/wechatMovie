'use strict';

module.exports = {
   "button":[
      {  
        "name": "排行榜",
        "sub_button":[
          {  
            "type": "click",
            "name": "最热",
            "key": "movie_hot",
            "sub_button": []
          },
          {  
            "type": "click",
            "name": "最冷",
            "key": "movie_cold",
            "sub_button": []
          }
        ]
      },
      {  
        "name": "分类",
        "sub_button":[
          {  
            "type": "click",
            "name": "犯罪",
            "key": "movie_crime",
            "sub_button": []
          },
          {  
            "type": "click",
            "name": "动画",
            "key": "movie_cartoon",
            "sub_button": []
          }
        ]
      },
      {  
        "type": "click",
        "name": "帮助",
        "key": "help",
        "sub_button":[]
      }
    ]
}