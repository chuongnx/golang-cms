package models

import (
	"time"

	"github.com/chuongnx/beego/orm"
)

// Article model articles in db
type Article struct {
	Id           int    `orm:"column(id);auto"`
	Key          string `orm:"column(key);size(255);"`
	User         *User  `orm:"rel(fk)"`
	FileName     string `orm:"column(filename);size(255);"`
	Title        string `orm:"column(title);size(255);"`
	ShortContent string `orm:"column(shortcontent);size(4000)"`
	Content      string `orm:"column(content);size(4000)"`
	Score        int    `orm:"column(score);"`
	PublishDate  string `orm:"column(publish_date);"`

	Director       string    `orm:"column(director);size(100)"`
	Actor          string    `orm:"column(actor);size(1000)"`
	Time           string    `orm:"column(time);size(30)"`
	PublishYear    string    `orm:"column(publish_year);"`
	Language       string    `orm:"column(language);size(30)"`
	Duration       string    `orm:"column(duration);size(30)"`
	National       string    `orm:"column(national);size(30)"`
	CreateTime     time.Time `orm:"column(create_time);type(timestamp);auto_now_add"`
	Type           int
	Stars          int // we may need redis help with this
	AllowComments  bool
	AllowReviews   bool
	FilmImage      string            `orm:"column(filmImage);size(300)" `
	PosterImage    string            `orm:"column(posterImage);size(300)" `
	TopicTags      string            `orm:"column(topictags);size(300)" `
	TaggedUsers    string            `orm:"column(taggedusers);size(300)" `
	Category       string            `orm:"column(category);size(1000)"`
	ArticleComment []*ArticleComment `orm:"reverse(many)"`
	Likes          []*ArticleLike    `orm:"reverse(many)"`
	Status         string            `orm:"column(status);size(100)"`
	Hightlight     string            `orm:"column(hightlight);size(20)"`
}

// ArticleComment model articles_comments in db
type ArticleComment struct {
	Id      int            `orm:"column(id);auto"`
	User    *User          `orm:"rel(fk)"`
	Article *Article       `orm:"rel(fk)"`
	Likes   []*CommentLike `orm:"reverse(many)"`
}

// Category model categories in db
type Category struct {
	Id   int    `orm:"column(id);auto"`
	Key  string `orm:"column(key);size(128)"`
	Name string `orm:"column(name);size(128)"`
	//Articles []*Article `orm:"reverse(many)"`
}

func GetListArticle(page, pageSize int, filters ...interface{}) ([]*Article, int64) {
	offset := (page - 1) * pageSize
	list := make([]*Article, 0)
	query := orm.NewOrm().QueryTable("Article")
	if len(filters) > 0 {
		l := len(filters)

		for k := 0; k < l; k += 2 {
			query = query.Filter(filters[k].(string), filters[k+1])
		}
	}
	total, _ := query.Count()
	query.OrderBy("-orderid", "-id").Limit(pageSize, offset).All(&list)

	return list, total
}
