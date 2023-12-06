package core

import (
	"errors"
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

	return url, nil
}

func InstallKit(repo string) error {
	url, err := getRepositoryUrl(repo)
	if err != nil {
		return err
	}

	EnsureTempDirectory()
	cloneFolder := GetTempDirectory()

	Execute("git", []string{"git", "clone", url, cloneFolder})

	return nil
}

func UninstallKit(kit string) error {
	folder := FindKitFolder(kit)
	if folder == "" {
		return errors.New("Kit not found")
	}
	Execute("rm", []string{"rm", "-rf", folder})

	return nil
}
