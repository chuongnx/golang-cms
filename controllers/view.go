package controllers

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/chuongnx/golang-cms/models"
	"github.com/chuongnx/golang-cms/utils"
)

// ArticleController ...
type ViewController struct {
	BaseController
}

// Get Displays Article by id
func (CTRL *ViewController) Get() {

	ArtID, err := strconv.Atoi(CTRL.Ctx.Input.Param(":id"))
	if err != nil {
		CTRL.Abort("403")
	}
	db := CTRL.GetDB("default")
	if ArtID != 0 {
		Art := new(models.Article)
		Art.Id = ArtID
		db.Read(Art, "Id")
		CTRL.Data["Article"] = Art
		//todo
		//Art.FileName = "IndependenceDayResurgence2016720pHDRip.mp4"
		filename, err := utils.Encrypt(Art.FileName, []byte("testtesttesttesttesttest"))
		if err != nil {
			// TODO: Properly handle error
			log.Fatal(err)
		}

		CTRL.Data["FileName"] = filename + ".mp4"
		CTRL.ConfigPage("view.html")
	}
}

func (CTRL *ViewController) Video() {
	const BUFSIZE = 1024 * 8
	videoid := CTRL.Ctx.Input.Param(":videoid")
	arrvideoid := strings.Split(videoid, ".")
	filename, err := utils.Decrypt(arrvideoid[0], []byte("testtesttesttesttesttest"))
	if err != nil {
		CTRL.Abort("403")
	}
	fullPath := "/movies/ipad/" + filename
	//path := "E:/Movies/IndependenceDayResurgence2016720pHDRip.mp4"
	println("path", fullPath)
	file, err := os.Open(fullPath)
	//println("err", err)
	if err != nil {
		CTRL.Abort("403")
		return
	}

	defer file.Close()

	fi, err := file.Stat()

	if err != nil {
		CTRL.Abort("500")
		return
	}

	fileSize := int(fi.Size())

	contentLength := strconv.Itoa(fileSize)
	contentEnd := strconv.Itoa(fileSize - 1)

	CTRL.Ctx.ResponseWriter.Header().Set("Content-Type", "video/mp4")
	CTRL.Ctx.ResponseWriter.Header().Set("Accept-Ranges", "bytes")
	CTRL.Ctx.ResponseWriter.Header().Set("Content-Length", contentLength)
	CTRL.Ctx.ResponseWriter.Header().Set("Content-Range", "bytes 0-"+contentEnd+"/"+contentLength)
	CTRL.Ctx.ResponseWriter.WriteHeader(200)

	buffer := make([]byte, BUFSIZE)

	for {
		n, err := file.Read(buffer)

		if n == 0 {
			break
		}

		if err != nil {
			break
		}

		data := buffer[:n]
		CTRL.Ctx.ResponseWriter.Write(data)
		//CTRL.Ctx.(http.Flusher).Flush()
	}

}
