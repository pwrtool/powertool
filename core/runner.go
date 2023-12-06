package core

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func RunKit(kit string, rundata Rundata) error {
	filepath := FindKitShFile(kit)
	RunShFile(filepath, rundata)

	return nil
}

func RunShFile(filepath string, rundata Rundata) error {
	rundataJson, err := json.Marshal(rundata)
	if err != nil {
		return err
	}
	rundataJsonString := strings.Join([]string{"'", string(rundataJson), "'"}, "")

	Execute(filepath, []string{filepath, rundataJsonString})

	return nil
}

func FindKitShFile(kit string) string {
	filepath := filepath.Join(FindKitFolder(kit), "run.sh")
	if _, err := os.Stat(filepath); err == nil {
		return filepath
	}
	return ""
}

func FindKitFolder(kit string) string {
	filepath := filepath.Join(GetPowertoolDirectory(), kit)
	if _, err := os.Stat(filepath); err == nil {
		return filepath
	}
	return ""
}

func Execute(script string, command []string) (bool, error) {

	cmd := &exec.Cmd{
		Path:   script,
		Args:   command,
		Stdout: os.Stdout,
		Stderr: os.Stderr,
	}

	err := cmd.Start()
	if err != nil {
		return false, err
	}

	err = cmd.Wait()
	if err != nil {
		return false, err
	}

	return true, nil
}
