package models

import (
	"github.com/chuongnx/beego"
	"github.com/chuongnx/beego/validation"
	"github.com/chuongnx/golang-cms/utils"
)

// Validate RegisterForm data
func (form *RegisterForm) Validate() bool {
	validator := validation.Validation{}
	isValid := false
	var err error
	if isValid, err = validator.Valid(form); err != nil {
		beego.Error(err)
	} else {
		if isValid {
			if form.Password != form.PasswordRe {
				validator.SetError("PasswordRe", "Passwords did not match")
				isValid = false
			}
		}
		if !isValid {
			form.InvalidFields = make(map[string]string, len(validator.Errors))
			for _, err := range validator.Errors {
				form.InvalidFields[err.Key] = err.Message
				beego.Debug(err.Key, err.Message)
			}
		}
	}
	return isValid
}

// Validate ArticleForm data
func (form *ArticleForm) Validate() bool {
	validator := validation.Validation{}
	isValid := false
	var err error
	if isValid, err = validator.Valid(form); err != nil {
		beego.Error(err)
	} else {
		/*
			if isValid {
				if form.Category != "" {
					validator.SetError("Category", "Invalid category")
					isValid = false
				}
			}
		*/
		if !isValid {
			form.InvalidFields = make(map[string]string, len(validator.Errors))
			for _, err := range validator.Errors {
				form.InvalidFields[err.Key] = err.Message
				beego.Debug(err.Key, err.Message)
			}
		}
	}
	return isValid
}

// Validate ImageForm data
func (form *ImageForm) Validate() bool {
	validator := validation.Validation{}
	isValid := false
	var err error
	if isValid, err = validator.Valid(form); err != nil {
		beego.Error(err)
	} else {
		if isValid {
			if !utils.ContainsKey(utils.ImageSizes, form.Targets) {
				validator.SetError("Category", "Invalid category")
				isValid = false
			}
		}
		if !isValid {
			form.InvalidFields = make(map[string]string, len(validator.Errors))
			for _, err := range validator.Errors {
				form.InvalidFields[err.Key] = err.Message
				beego.Debug(err.Key, err.Message)
			}
		}
	}
	return isValid
}
