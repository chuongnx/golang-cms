package db

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"

	"github.com/chuongnx/beego"
	"github.com/chuongnx/golang-cms/models"
	"github.com/chuongnx/golang-cms/utils"
)

// InsertDemoData insert demo data in database if ReCreateDatabase is true
func InsertDemoData() bool {

	db := MainDatabase.Orm
	db.Using("default")
	category := models.Category{Key: "hanh-dong", Name: "Phim hành động"}
	user := models.User{Username: "admin"}
	salt := utils.GetRandomString(10)
	encodedPassword := salt + "$" + utils.EncodePassword("admin", salt)
	profile := new(models.Profile)
	profile.Age = 30
	profile.Name = "Test Rosario"
	profile.Avatar = "male"
	profile.Description = "Hi, Please insert here a litte description about you. this is just a demo."
	user.Profile = profile
	db.Insert(profile)
	user.Password = encodedPassword
	user.Rands = salt
	user.Admin = true
	article := models.Article{
		Title:    "This is an example of article!",
		Content:  "<div class=\"row\"> <div class=\"col s12\"> <div class=\"card-panel\"> <span class=\"card-title grey-text\"></span> <div class=\"row\"> <div class=\"col s12\"> <p>Sabemos que los ácaros sólo pueden sobrevivir mediante la ingestión de agua de la atmósfera, utilizando glándulas pequeñas en el exterior de su cuerpo. Algo tan simple como dejar la cama sin hacer durante el día puede eliminar la humedad de las sábanas y el colchón, provocando que en consecuencia, los ácaros se deshidraten y finalmente mueran.</p> <blockquote> A subscription costs just £1 GBP / $1.60 USD <strong>per device</strong> <em>per month (volume pricing is available).</em><br> We offer a free 14 day trial with no obligation to subscribe once the trial ends. </blockquote> <p><span class=\"text-primarycolor\" style=\"font-weight:500;\">PRO</span> features are included for the life of the subscription.</p> <div class=\"center\"> <a href=\"#\" class=\"wistia-popover[height=433,playerColor=7b796a,width=800]waves-effect waves-light btn light-blue darken-3\" style=\"margin-bottom:10px;\"><i class=\"mdi-youtube-play left\"></i>Watch Video</a> <a class=\"waves-effect waves-light btn\" href=\"#\" style=\"margin-bottom:10px;\">Free Trial</a> <script charset=\"ISO-8859-1\" src=\"#\"></script> </div> <div class=\"center\"> <a href=\"https://www.kbremote.net/Home/Start\"><img src=\"http://misimagenesde.com/wp-content/uploads/2011/04/paisaje.jpg\" class=\"responsive-img\"></a> </div> </div> </div> <span style=\"font-size:0.7rem;\">*Subscriptions are re-billed every 30 days and you will be charged for the amount of devices registered to your account. Annual subscriptions require an upfront payment.</span> </div> </div> </div>",
		Category: category.Key,
		User:     &user}
	db.Insert(&user)
	db.Insert(&category)
	category = models.Category{Key: "tinh-cam", Name: "Phim tình cảm"}
	db.Insert(&category)
	db.Insert(&article)
	htmlblock := models.Block{Name: "Default html block1", Type: "html", IsActive: true, Position: 1, Content: "{\"body\": \"this is a test for default blocks position 1 !\"}"}
	db.Insert(&htmlblock)
	htmlblock = models.Block{Name: "Default html block2", Type: "html", IsActive: true, Position: 2, Content: "{\"body\": \"this is a test for default blocks position 2 !\"}"}
	db.Insert(&htmlblock)

	fmt.Println("\nDoc thu muc video\n")
	videodir := beego.AppConfig.String("VideoDir")
	files, err := ioutil.ReadDir(videodir)
	//files, err := ioutil.ReadDir("/movies/ipad")
	if err != nil {
		log.Fatal(err)
	}
	for _, f := range files {

		article := models.Article{
			Key:          strings.Split(f.Name(), ".")[0],
			FileName:     f.Name(),
			Title:        f.Name(),
			ShortContent: f.Name(),
			Content:      f.Name(),
			Category:     category.Key,
			User:         &user,
			Status:       "CHUA_DUYET",
		}
		fmt.Println(article)
		db.Insert(&article)
	}
	return true
}
