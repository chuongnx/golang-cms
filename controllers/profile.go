package controllers

import (
	"strconv"

	"github.com/chuongnx/golang-cms/models"
)

// ProfileController for users
type ProfileController struct {
	BaseController
}

// UserPanelView  Display user's homepage
func (CTRL *ProfileController) UserPanelView() {
	UID := CTRL.Ctx.Input.Param(":id")
	if CTRL.Ctx.Input.Param(":id") == "0" {
		CTRL.ConfigPage("user-profile.html")
	} else {
		UID, err := strconv.Atoi(UID)
		if err != nil {
			CTRL.Abort("404")
		}
		CTRL.populateProfileViewData(UID)
		CTRL.ConfigPage("profile-view.html")
	}
}

// populateProfileViewData Displays profile by id
func (CTRL *ProfileController) populateProfileViewData(UID int) bool {
	db := CTRL.GetDB()
	userView := models.User{Id: UID}
	db.Read(&userView, "Id")
	Permissions := userView.Profile.GetPermissions(CTRL.Data["user"].(models.User))
	// TODO : populate permissions on CTRL.Data
	_ = Permissions
	CTRL.Data["Profile"] = userView.Profile
	return true
}
