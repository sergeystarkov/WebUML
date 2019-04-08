package utils

import (
	"fmt"
	"log"

	"github.com/sasbury/mini"
)

var config map[string]interface{}

func GetConfig() map[string]interface{} {
	cfg, err := mini.LoadConfiguration("conf.ini")
	if err != nil {
		log.Fatalln("Не удалось заргузить файл конфигурации.")
		return nil
	}

	if config == nil {
		config = make(map[string]interface{})

		//Database config
		config["DB_host"] = cfg.StringFromSection("database", "host", "127.0.0.1")
		config["DB_port"] = cfg.StringFromSection("database", "port", "5432")
		config["DB_name"] = cfg.StringFromSection("database", "dbname", "postres")
		config["DB_sslmode"] = cfg.StringFromSection("database", "sslmode", "disable")
		config["DB_user"] = cfg.StringFromSection("database", "username", "postgres")
		config["DB_pass"] = cfg.StringFromSection("database", "password", "postgres")

		config["ListenAddress"] = cfg.StringFromSection("server", "ListenAddress", "127.0.0.1:81")
	}

	return config
}

func GetDBParams() string {
	info := fmt.Sprintf("host=%s port=%s dbname=%s "+
		"sslmode=%s user=%s password=%s ",
		config["DB_host"].(string),
		config["DB_port"].(string),
		config["DB_name"].(string),
		config["DB_sslmode"].(string),
		config["DB_user"].(string),
		config["DB_pass"].(string),
	)
	return info
}
