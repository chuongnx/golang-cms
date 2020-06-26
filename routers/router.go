package routers

import (
	"github.com/chuongnx/beego"
	"github.com/chuongnx/golang-cms/controllers"
	"github.com/chuongnx/golang-cms/core/template"
)

func init() {
	for template, styles := range template.Templates {
		for _, style := range styles {
			// beego.BConfig.WebConfig.StaticDir
			beego.SetStaticPath("/static/"+template+"/"+style, "views/"+template+"/styles/"+style)
		}
	}
	beego.SetStaticPath("/static", "static")
	// guests request
	beego.Router("/", &controllers.IndexController{})
	beego.Router("/login", &controllers.LoginController{}, "get:LoginView;post:Login")
	beego.Router("/logout", &controllers.LoginController{}, "get:Logout")
	beego.Router("/register", &controllers.LoginController{}, "get:RegisterView;post:Register")
	beego.Router("/article", &controllers.ArticleController{}, "get:GetAll")
	beego.Router("/article/:id:int/delete", &controllers.ArticleController{}, "get:Delete")
	beego.Router("/article/:id:int/:action:string", &controllers.ArticleController{}, "get:Get;post:Post")
	beego.Router("/xem-phim/:name-:id:int.html", &controllers.ViewController{})
	beego.Router("/channel/:page:int", &controllers.IndexController{}, "get:GetPage")
	beego.Router("/video/:videoid", &controllers.ViewController{}, "get:Video")
	beego.Router("/phim/:category.html", &controllers.IndexController{}, "get:Category")
	// User requests
	beego.Router("/ajax/image/:id:int", &controllers.AjaxController{}, "get:GetImageUploadStatus;post:PostImage")
	beego.Router("/profile/:id:int/:action:string", &controllers.ProfileController{}, "get:UserPanelView")

	// filters
	beego.InsertFilter("/profile/:id:int/show", beego.BeforeRouter, controllers.AuthRequest)
	beego.InsertFilter("/article/:id:int/edit", beego.BeforeRouter, controllers.AuthRequest)
	beego.InsertFilter("/article/:id:int/delete", beego.BeforeRouter, controllers.AuthRequest)
	beego.InsertFilter("/article/:id:int/comment", beego.BeforeRouter, controllers.AuthRequest)
	beego.InsertFilter("/ajax/image/:id:int", beego.BeforeRouter, controllers.AuthRequest)
	beego.InsertFilter("/*", beego.BeforeExec, controllers.DetectUserAgent)
	beego.InsertFilter("/", beego.BeforeExec, controllers.DetectUserAgent)
}
