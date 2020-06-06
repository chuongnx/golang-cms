package main

import (
	"github.com/chuongnx/beego"
	_ "github.com/chuongnx/beego/session/redis"
	_ "github.com/chuongnx/golang-cms/core/template"
	_ "github.com/chuongnx/golang-cms/routers"
	"github.com/chuongnx/golang-cms/utils"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
)

func init() {
	currentEnvironment := beego.AppConfig.String("RunMode")
	utils.SessionInit(currentEnvironment)
}

func main() {
	beego.Run()
}
