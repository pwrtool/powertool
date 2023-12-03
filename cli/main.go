package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var rootCmd = &cobra.Command{
	Use:   "pt",
	Short: "Automate everything everywhere",
	Long:  "The CLI frontend for powertool. See full documentation at https://powertool.dev",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Hello, world!")
	},
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of pt",
	Long:  "Prints the version number of the powertool cli",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("pt v0.0.1")
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Print(err)
		os.Exit(1)
	}
}
