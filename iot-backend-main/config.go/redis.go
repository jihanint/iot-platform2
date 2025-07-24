package config

import (
	"fmt"

	"github.com/go-redis/redis"
)

var client *redis.Client

func RedisInit() {
	client = redis.NewClient(&redis.Options{
		Addr: GetConfig().RedisAddress,
	})

	status := client.Ping()
	_, err := status.Result()
	if err != nil {
		err = fmt.Errorf("redis connection error: %v", err)
		panic(err)
	}

	fmt.Println("Connected to Redis")
}

func RedisClient() *redis.Client {
	return client
}
