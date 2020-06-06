package controllers

import (
	"strconv"

	"github.com/chuongnx/beego/utils/pagination"
	"github.com/chuongnx/golang-cms/models"
)

type IndexController struct {
	BaseController
}

// Get main page
func (CTRL *IndexController) Get() {
	pageSize := int(12)
	//page := int64(1)
	db := CTRL.GetDB("default")
	CTRL.ConfigPage("index.html")
	cats := new([]*models.Category)
	db.QueryTable("category").All(cats)
	CTRL.Data["Categories"] = *cats

	//offset := (page - 1) * pageSize
	articles := new([]*models.Article)
	total, _ := db.QueryTable("article").Count()
	paginator := pagination.SetPaginator(CTRL.Ctx, pageSize, total)
	db.QueryTable("article").OrderBy("-title").Limit(pageSize, paginator.Offset()).All(articles)
	/*
		filters := make([]interface{}, 0)
		//filters = append(filters, "status", 1)
		//filters = append(filters, "class_id", 5)
		result, _ := models.GetListArticle(1, 6, filters...)
		query := orm.NewOrm().QueryTable("Article")
		page = 1
		pageSize = 10
		offset := (page - 1) * pageSize
		query.OrderBy("-orderid", "-id").Limit(pageSize, offset).All(&list)
	*/
	println("paginator.Offset() 1", paginator.Offset())
	CTRL.Data["paginator"] = paginator
	CTRL.Data["Articles"] = articles
	//CTRL.Data["Total"] = math.Round(float64(total / pageSize))
	CTRL.Data["Website"] = "127.0.0.1:8080"
	CTRL.Data["description"] = "Fast and stable CMS"
	CTRL.Data["Email"] = "chuongnx@gmail.com"
	CTRL.Data["phim"] = "phim hanh dong"
}

func (CTRL *IndexController) GetPage() {
	page, err := strconv.Atoi(CTRL.Ctx.Input.Param(":page"))
	if err != nil {
		page = 1
	}
	pageSize := 12
	CTRL.Ctx.Input.Param(":file")
	db := CTRL.GetDB("default")
	CTRL.ConfigPage("index.html")
	cats := new([]*models.Category)
	db.QueryTable("category").All(cats)
	CTRL.Data["Categories"] = *cats

	offset := (page - 1) * pageSize
	articles := new([]*models.Article)
	total, _ := db.QueryTable("article").Count()
	db.QueryTable("article").OrderBy("-title").Limit(pageSize, offset).All(articles)
	/*
		filters := make([]interface{}, 0)
		//filters = append(filters, "status", 1)
		//filters = append(filters, "class_id", 5)
		result, _ := models.GetListArticle(1, 6, filters...)
		query := orm.NewOrm().QueryTable("Article")
		page = 1
		pageSize = 10
		offset := (page - 1) * pageSize
		query.OrderBy("-orderid", "-id").Limit(pageSize, offset).All(&list)
	*/
	CTRL.Data["Articles"] = articles
	CTRL.Data["Total"] = total
	CTRL.Data["Website"] = "127.0.0.1:8080"
	CTRL.Data["description"] = "Fast and stable CMS"
	CTRL.Data["Email"] = "chuongnx@gmail.com"
	CTRL.Data["phim"] = "phim hanh dong"
}
