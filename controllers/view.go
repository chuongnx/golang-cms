package controllers

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/chuongnx/beego"
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
	videodir := beego.AppConfig.String("VideoDir")
	fullPath := videodir + `\` + filename
	//path := "E:/Movies/IndependenceDayResurgence2016720pHDRip.mp4"
	println("path", fullPath)
	file, err := os.Open(fullPath)
	if err != nil {
		CTRL.Abort("500")
		return
	}
	defer file.Close()
	fi, err := file.Stat()
	if err != nil {
		CTRL.Abort("500")
		return
	}
	fileSize := int(fi.Size())

	if len(CTRL.Ctx.ResponseWriter.Header().Get("Range")) == 0 {
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
			//w.Write(data)
			//w.(http.Flusher).Flush()
			CTRL.Ctx.ResponseWriter.Write(data)
			CTRL.Ctx.ResponseWriter.Flush()
		}

	} else {
		rangeParam := strings.Split(CTRL.Ctx.ResponseWriter.Header().Get("Range"), "=")[1]
		splitParams := strings.Split(rangeParam, "-")
		// response values
		contentStartValue := 0
		contentStart := strconv.Itoa(contentStartValue)
		contentEndValue := fileSize - 1
		contentEnd := strconv.Itoa(contentEndValue)
		contentSize := strconv.Itoa(fileSize)
		if len(splitParams) > 0 {
			contentStartValue, err = strconv.Atoi(splitParams[0])
			if err != nil {
				contentStartValue = 0
			}
			contentStart = strconv.Itoa(contentStartValue)
		}

		if len(splitParams) > 1 {
			contentEndValue, err = strconv.Atoi(splitParams[1])
			if err != nil {
				contentEndValue = fileSize - 1
			}
			contentEnd = strconv.Itoa(contentEndValue)
		}
		contentLength := strconv.Itoa(contentEndValue - contentStartValue + 1)
		CTRL.Ctx.ResponseWriter.Header().Set("Content-Type", "video/mp4")
		CTRL.Ctx.ResponseWriter.Header().Set("Accept-Ranges", "bytes")
		CTRL.Ctx.ResponseWriter.Header().Set("Content-Length", contentLength)
		CTRL.Ctx.ResponseWriter.Header().Set("Content-Range", "bytes "+contentStart+"-"+contentEnd+"/"+contentSize)
		CTRL.Ctx.ResponseWriter.WriteHeader(206)

		buffer := make([]byte, BUFSIZE)
		file.Seek(int64(contentStartValue), 0)
		writeBytes := 0
		for {
			n, err := file.Read(buffer)
			writeBytes += n
			if n == 0 {
				break
			}
			if err != nil {
				break
			}
			if writeBytes >= contentEndValue {
				data := buffer[:BUFSIZE-writeBytes+contentEndValue+1]
				CTRL.Ctx.ResponseWriter.Write(data)
				CTRL.Ctx.ResponseWriter.Flush()
				break
			}
			data := buffer[:n]
			CTRL.Ctx.ResponseWriter.Write(data)
			CTRL.Ctx.ResponseWriter.Flush()
		}
	}
	/*
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
	*/

}
