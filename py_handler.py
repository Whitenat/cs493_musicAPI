import os
import json

def heyo(event, context):
	return {
		"statusCode" : 200,
		"headers": {
			"Context-Type" : "application/json"
		},
		"body" : json.dumps({
			"event" : event
			})
	}