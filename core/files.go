package core

import (
	"os"
)

const powertoolDirectory = ".powertool"
const powertoolConfigFile = ".config/powertool/config.yaml"
const localConfigFilename = ".ptconfig.yaml"

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

func GetConfigFilepath() string {
	homedir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return homedir + "/" + powertoolConfigFile
}

func EnsureConfigFile() {
	filepath := GetConfigFilepath()
	if _, err := os.Stat(filepath); os.IsNotExist(err) {
		os.MkdirAll(filepath, 0755)
	}
}

func GetTempDirectory() string {
	return "/tmp/powertool"
}

func EnsureTempDirectory() {
	if _, err := os.Stat(GetTempDirectory()); os.IsNotExist(err) {
		os.RemoveAll(GetTempDirectory())
		os.MkdirAll(GetTempDirectory(), 0755)
	}
}
