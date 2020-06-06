package defaults

import (
	"github.com/chuongnx/beego"
	"github.com/chuongnx/golang-cms/core/defaults/modules"
)

// GetDefaultMenu get menu
func GetDefaultMenu() string {
	var menuitems string
	for _, mod := range modules.Modules {
		modConfig, err := beego.AppConfig.GetSection("module-" + mod.Name)
		if err == nil && modConfig["activated"] != "" && modConfig["hidden"] != "" {
			menuitems = mod.Menu
		}
	}
	return menuitems
}
