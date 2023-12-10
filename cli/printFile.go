package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

func printFile(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatalln("Error opening file:", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatalln("Error reading file:", err)
	}

	fmt.Println("View Readme File: " + filepath)
}
