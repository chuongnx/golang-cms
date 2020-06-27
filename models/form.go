package models

// RegisterForm ...
type RegisterForm struct {
	Name          string            `form:"name" valid:"Required;"`
	Email         string            `form:"email" valid:"Required;"`
	Username      string            `form:"username" valid:"Required;AlphaNumeric;MinSize(4);MaxSize(300)"`
	Password      string            `form:"password" valid:"Required;MinSize(4);MaxSize(30)"`
	PasswordRe    string            `form:"passwordre" valid:"Required;MinSize(4);MaxSize(30)"`
	Gender        bool              `form:"gender" valid:"Required"`
	InvalidFields map[string]string `form:"-"`
}

// ArticleForm ...
type ArticleForm struct {
	Id            int               `form:"id"`
	Key           string            `form:"key" valid:"Required;MinSize(1);MaxSize(300)"`
	User          *User             `form:"user" valid:"Required;"`
	FileName      string            `form:"file_name" valid:"Required;MinSize(1);MaxSize(300)"`
	ShortContent  string            `form:"short_content"`
	Score         int               `form:"score" `
	PublishDate   string            `form:"publish_date" `
	Director      string            `form:"director" `
	Actor         string            `form:"actor" `
	Time          string            `form:"time" `
	PublishYear   string            `form:"publish_year" `
	Language      string            `form:"language" `
	Duration      string            `form:"duration" `
	National      string            `form:"national"`
	Title         string            `form:"title" valid:"Required;MinSize(1);MaxSize(300)"`
	Category      string            `form:"category"`
	Content       string            `form:"content" valid:"Required;MinSize(1);MaxSize(2000)"`
	TopicTags     string            `form:"topic_tags" valid:"MinSize(0);MaxSize(300)"`
	TaggedUsers   string            `form:"tagged_users" valid:"MinSize(0);MaxSize(300)"`
	FilmImage     string            `form:"filmImage" valid:"MinSize(0);MaxSize(300)"`
	PosterImage   string            `form:"posterImage" valid:"MinSize(0);MaxSize(300)"`
	AllowReviews  bool              `form:"allow_reviews" valid:"Required"`
	AllowComments bool              `form:"allow_comments" valid:"Required"`
	InvalidFields map[string]string `form:"-"`
	Status        string            `form:"status"`
	Hightlight    string            `form:"hightlight"`
}

// ImageForm ...
type ImageForm struct {
	Name          string            `form:"name" valid:"Required;"`
	User          int               `form:"user" valid:"Required;Numeric"`
	Targets       string            `form:"target" valid:"Required;"`
	PivoteX       int               `form:"pivotex" valid:"Required;Numeric"`
	PivoteY       int               `form:"pivotey" valid:"Required;Numeric"`
	ImageType     string            `form:"name" valid:"Required;"`
	Description   string            `form:"description" valid:"Required;AlphaNumeric;MinSize(4);MaxSize(300)"`
	File          []byte            `form:"-"`
	InvalidFields map[string]string `form:"-"`
}
