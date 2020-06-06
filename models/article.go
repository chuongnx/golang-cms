package models

import (
	"time"

	"github.com/chuongnx/beego/orm"
)

// Article model articles in db
type Article struct {
	Id             int       `orm:"column(id);auto"`
	Key            string    `orm:"column(key);size(255);"`
	User           *User     `orm:"rel(fk)"`
	FileName       string    `orm:"column(filename);size(255);"`
	Title          string    `orm:"column(title);size(255);"`
	ShortContent   string    `orm:"column(shortcontent);size(4000)"`
	Content        string    `orm:"column(content);size(4000)"`
	CreateTime     time.Time `orm:"column(create_time);type(timestamp);auto_now_add"`
	Type           int
	Stars          int // we may need redis help with this
	AllowComments  bool
	Category       *Category         `orm:"rel(fk);null;default(null)"`
	ArticleComment []*ArticleComment `orm:"reverse(many)"`
	Likes          []*ArticleLike    `orm:"reverse(many)"`
	Status         string            `orm:"column(status);size(100)"`
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
	Id       int        `orm:"column(id);auto"`
	Name     string     `orm:"column(name);size(128)"`
	Articles []*Article `orm:"reverse(many)"`
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
