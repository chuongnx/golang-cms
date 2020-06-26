package routers

import (
	"github.com/chuongnx/beego"
	"github.com/chuongnx/golang-cms/controllers"
	admins "github.com/chuongnx/golang-cms/controllers/admin"
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

	beego.Router("/xem-phim/:name-:id:int.html", &controllers.ViewController{})
	beego.Router("/channel/:page:int", &controllers.IndexController{}, "get:GetPage")
	beego.Router("/video/:videoid", &controllers.ViewController{}, "get:Video")
	beego.Router("/phim/:category.html", &controllers.IndexController{}, "get:Category")
	// User requests
	beego.Router("/ajax/image/:id:int", &controllers.AjaxController{}, "get:GetImageUploadStatus;post:PostImage")

	ns := beego.NewNamespace("admin",
		beego.NSRouter("/login", &admins.LoginController{}, "get:LoginView;post:Login"),
		beego.NSRouter("/logout", &admins.LoginController{}, "get:Logout"),
		beego.NSRouter("/register", &admins.LoginController{}, "get:RegisterView;post:Register"),
		beego.NSRouter("/article", &admins.ArticleController{}, "get:GetAll"),
		beego.NSRouter("/article/:id:int/delete", &admins.ArticleController{}, "get:Delete"),
		beego.NSRouter("/article/:id:int/:action:string", &admins.ArticleController{}, "get:Get;post:Post"),
		beego.NSRouter("/profile/:id:int/:action:string", &admins.ProfileController{}, "get:UserPanelView"),
	)
	beego.AddNamespace(ns)
	// filters
	beego.InsertFilter("/admin/profile/:id:int/show", beego.BeforeRouter, admins.AuthRequest)
	beego.InsertFilter("/admin/article/:id:int/edit", beego.BeforeRouter, admins.AuthRequest)
	beego.InsertFilter("/admin/article/:id:int/delete", beego.BeforeRouter, admins.AuthRequest)
	beego.InsertFilter("/admin/article/:id:int/comment", beego.BeforeRouter, admins.AuthRequest)
	beego.InsertFilter("/admin/ajax/image/:id:int", beego.BeforeRouter, admins.AuthRequest)
	beego.InsertFilter("/*", beego.BeforeExec, admins.DetectUserAgent)
	beego.InsertFilter("/", beego.BeforeExec, admins.DetectUserAgent)
}
