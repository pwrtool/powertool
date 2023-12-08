package core

import (
	"os"
)

const powertoolDirectory = ".powertool"

func GetPowertoolDirectory() string {
	homedir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return homedir + "/" + powertoolDirectory
}

func EnsurePowertoolDirectory() {
	filepath := GetPowertoolDirectory()
	if _, err := os.Stat(filepath); os.IsNotExist(err) {
		os.MkdirAll(filepath, 0755)
	}
}

func GetTempDirectory() string {
	return "/tmp/powertool"
}

func EnsureTempDirectory() {
	os.RemoveAll(GetTempDirectory())
	os.MkdirAll(GetTempDirectory(), 0755)
}

func EnsureDirectory(dir string) {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}
}
