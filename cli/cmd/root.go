package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "pt",
	Short: "Automate everything everywhere",
	Long:  "The CLI frontend for powertool. See full documentation at https://powertool.dev",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Hello, world!")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Print(err)
		os.Exit(1)
	}
}
