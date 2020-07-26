package admins

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/httplib"
	"github.com/chuongnx/beego/utils/pagination"
	"github.com/chuongnx/golang-cms/models"
)

// ArticleController ...
type ArticleController struct {
	BaseController
}

func (CTRL *ArticleController) GetAll() {
	pageSize := int(12)
	//page := int64(1)
	db := CTRL.GetDB("default")
	CTRL.ConfigPage("article-list.html")
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
	CTRL.Data["paginator"] = paginator
	CTRL.Data["Articles"] = articles

}

// Get Displays Article by id
func (CTRL *ArticleController) Get() {
	ArtID, err := strconv.Atoi(CTRL.Ctx.Input.Param(":id"))
	if err != nil {
		CTRL.Abort("403")
	}
	db := CTRL.GetDB("default")
	if ArtID == 0 {
		//cat := new(models.Category)
		//cat.Id = 0
		//db.Read(cat, "Id")
		Art := new(models.Article)
		//Art.Category = cat
		CTRL.Data["form"] = Art
		cats := new([]models.Category)
		db.QueryTable("category").All(cats)

		CTRL.Data["Categories"] = &cats
		CTRL.ConfigPage("article-editor.html")
	} else {

		//cat := new(models.Category)
		//cat.Id = 0
		//db.Read(cat, "Id")

		Art := new(models.Article)
		//Art.Category = cat
		Art.Id = ArtID
		db.Read(Art, "Id")

		type Detail struct {
			Code      string `json:"code"`
			Name      string `json:"name"`
			Rating    int    `json:"rating"`
			Thumbnail string `json:"thumbnail"`
			Summary   string `json:"summary"`
		}
		req := httplib.Get("http://vuahd.tv/api/movies/i11084?ext=1&lang=vi")
		detail := Detail{}
		arrbyte, _ := req.Bytes()
		err = json.Unmarshal(arrbyte, &detail)
		fmt.Println(detail.Summary)
		CTRL.Data["data"] = &detail
		CTRL.Data["form"] = &Art
		cats := new([]models.Category)
		db.QueryTable("category").All(cats)
		CTRL.Data["Categories"] = &cats
		CTRL.ConfigPage("article-editor.html")
	}
}

// Post create/update article
func (CTRL *ArticleController) Post() {
	form := new(models.ArticleForm)
	Art := new(models.Article)
	if err := CTRL.ParseForm(form); err != nil {
		CTRL.Abort("401")
	} else {
		db := CTRL.GetDB()
		if !form.Validate() {
			CTRL.Data["form"] = form
			cats := new([]*models.Category)
			db.QueryTable("category").All(cats)
			CTRL.Data["Categories"] = cats
			CTRL.ConfigPage("article-editor.html")
			for key, msg := range form.InvalidFields {
				fmt.Println(key, msg)
			}
		} else {
			//cat := new(models.Category)
			//cat.Id = form.Category
			//db.Read(cat, "Id")

			if form.Id > 0 {

				user := CTRL.Data["user"].(models.User)
				fmt.Println("user", user)
				Art.Id = form.Id
				Art.Category = form.Category
				Art.User = &user
				Art.Key = form.Key
				Art.Title = form.Title
				Art.FileName = form.FileName
				Art.Score = form.Score
				Art.PublishDate = form.PublishDate
				Art.Director = form.Director
				Art.Actor = form.Actor
				Art.PublishYear = form.PublishYear
				Art.National = form.National
				Art.Language = form.Language
				Art.Duration = form.Duration
				Art.ShortContent = form.ShortContent
				Art.Content = form.Content
				Art.AllowComments = form.AllowComments
				Art.AllowReviews = form.AllowReviews
				Art.TaggedUsers = form.TaggedUsers
				Art.TopicTags = form.TopicTags
				Art.FilmImage = form.FilmImage
				Art.PosterImage = form.PosterImage
				Art.CreateTime = time.Now()
				Art.Status = form.Status
				fmt.Println("Art", Art)
				db.Update(Art)
				CTRL.Data["form"] = Art
				//CTRL.ConfigPage("article.html")
				CTRL.Redirect("/admin/article", 302)
			} else {

				user := CTRL.Data["user"].(models.User)
				fmt.Println("user", user)
				Art.Id = form.Id
				Art.Category = form.Category
				Art.User = &user
				Art.Key = form.Key
				Art.Title = form.Title
				Art.FileName = form.FileName
				Art.Score = form.Score
				Art.PublishDate = form.PublishDate
				Art.Director = form.Director
				Art.Actor = form.Actor
				Art.PublishYear = form.PublishYear
				Art.National = form.National
				Art.Language = form.Language
				Art.Duration = form.Duration
				Art.ShortContent = form.ShortContent
				Art.Content = form.Content
				Art.AllowComments = form.AllowComments
				Art.AllowReviews = form.AllowReviews
				Art.TaggedUsers = form.TaggedUsers
				Art.TopicTags = form.TopicTags
				Art.FilmImage = form.FilmImage
				Art.PosterImage = form.PosterImage
				Art.CreateTime = time.Now()
				Art.Status = form.Status
				db.Insert(Art)
				CTRL.Data["form"] = Art
				//CTRL.ConfigPage("article.html")
				CTRL.Redirect("/admin/article", 302)
			}
		}
	}
}

// Post create/update article
func (CTRL *ArticleController) Delete() {
	ArtID, err := strconv.Atoi(CTRL.Ctx.Input.Param(":id"))
	println("ArtID", ArtID)
	if err != nil {
		CTRL.Abort("403")
	}
	db := CTRL.GetDB("default")
	if ArtID > 0 {
		Art := new(models.Article)
		Art.Id = ArtID
		db.Delete(Art, "Id")
		CTRL.Redirect("/admin/article", 302)
	}
}

// Post create/update article
func (CTRL *ArticleController) SyncData() {
	db := CTRL.GetDB()
	type User struct {
		Code      string  `json:"code"`
		Name      string  `json:"name"`
		Rating    float32 `json:"rating"`
		Thumbnail string  `json:"thumbnail"`
	}
	type Detail struct {
		Code      string  `json:"code"`
		Name      string  `json:"name"`
		NameVn    string  `json:"name_vn"`
		Rating    float32 `json:"rating"`
		Duration  string  `json:"duration"`
		Thumbnail string  `json:"thumbnail"`
		Summary   string  `json:"summary"`
	}
	users := []User{}
	ArtID, err := strconv.Atoi(CTRL.Ctx.Input.Param(":id"))
	println("ArtID", ArtID)
	if err != nil {
		//	CTRL.Abort("403")
	}
	data := new(interface{})
	req := httplib.Get("http://vuahd.tv/api/movies?pg_size=10&page=1")
	req.ToJSON(data)
	arrbyte, err := req.Bytes()
	println(err)
	err = json.Unmarshal(arrbyte, &users)
	println(err)
	articles := new([]*models.Article)
	db.QueryTable("article").OrderBy("-title").Limit(-1).All(articles)

	for _, article := range *articles {

		req := httplib.Get("http://vuahd.tv/api/movies/" + article.Key + "?ext=1&lang=vi")
		detail := Detail{}
		arrbyte, err = req.Bytes()
		err = json.Unmarshal(arrbyte, &detail)
		//fmt.Println(i, s.Code)
		//pic := httplib.Get(`http://vuahd.tv` + detail.Thumbnail)
		//err = pic.ToFile(detail.Thumbnail)
		//println("savefile", s.Code)
		//Art := new(models.Article)
		//user := new(models.User)
		//Art.Key = s.Code
		//article := models.Article{Key: "i12019"}

		//fmt.Println("xxxxx", i, article.Key)
		article.Title = detail.NameVn
		//article.FileName = detail.Name
		article.Score = detail.Rating
		article.Duration = detail.Duration
		article.ShortContent = detail.Summary
		article.Content = detail.Summary
		article.FilmImage = strings.Replace(detail.Thumbnail, "/static/upload_images/", "", 1)
		article.Status = "DA_DUYET"
		db.Update(article)
		/*
			Art.Title = detail.Name_vn
			Art.FileName = detail.Name
			Art.Score = detail.Rating
			Art.ShortContent = detail.Summary
			Art.Content = detail.Summary
			Art.FilmImage = detail.Thumbnail
			Art.Status = "CHUA_DUYET"
			db.Update(Art)
		*/
	}

	//db := CTRL.GetDB("default")

	CTRL.Data["json"] = &data
	CTRL.ServeJSON()
}
