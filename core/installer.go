package core

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

var originAliases = map[string]string{
	"github.com":    "https://github.com",
	"gitlab.com":    "https://gitlab.com",
	"bitbucket.org": "https://bitbucket.org",
	"gh":            "https://github.com",
	"gl":            "https://gitlab.com",
	"bb":            "https://bitbucket.org",
}

func GitClone(url string, folder string) error {
	cmd := exec.Command("git", "clone", url, folder)

	err := cmd.Run()
	cmd.Output()

	if err != nil {
		return err
	}

	return nil
}

func getRepositoryUrl(repo string) (string, error) {
	urlParts := strings.Split(repo, "/")
	if len(urlParts) < 3 {
		return "", errors.New("Invalid repo URL. Url must have at least three parts.")
	}
	origin := urlParts[0]
	owner := urlParts[1]
	repoName := urlParts[2]

	if originAliases[origin] != "" {
		origin = originAliases[origin]
	}

	url := strings.Join([]string{origin, owner, repoName}, "/")
	url = strings.Join([]string{url, ".git"}, "")

	return url, nil
}

func getKitAndUserFromRepo(repo string) (string, string) {
	urlParts := strings.Split(repo, "/")
	if len(urlParts) < 3 {
		return "", ""
	}

	owner := urlParts[1]
	repoName := urlParts[2]

	return owner, repoName
}

func InstallKit(repo string) error {
	url, err := getRepositoryUrl(repo)
	user, kit := getKitAndUserFromRepo(repo)
	if err != nil {
		return err
	}

	EnsureTempDirectory()
	EnsurePowertoolDirectory()

	cloneFolder := GetTempDirectory()
	installFolder := GetPowertoolDirectory() + "/" + user + "/" + kit

	fmt.Println("Cloning", url, "to", cloneFolder)

	err = GitClone(url, cloneFolder)
	if err != nil {
		return err
	}
	fmt.Println("Repo successfully cloned")

	// run the install script
	err = RunInstallScript(installFolder)
	if err != nil {
		return err
	}
	fmt.Println("Install script ran successfully")

	return nil
}

func RunInstallScript(installFolder string) error {
	scriptPath := GetTempDirectory() + "/install.sh"
	// check if it exists
	if _, err := os.Stat(scriptPath); err == nil {
		// run it
		fmt.Printf("Installing in %s\n", installFolder)
		Execute(scriptPath, []string{scriptPath, installFolder})
		return nil
	}

	return errors.New("Install script not found. If /tmp/powertool/install.sh exists, this is a bug.")

}

func UninstallKit(kit string) error {
	folder := FindKitFolder(kit)
	if folder == "" {
		return errors.New("Kit not found")
	}
	exec.Command("rm", "-rf", folder).Run()

	return nil
}
