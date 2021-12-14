## app-analytics-definitions

This repo contains shared analytics definitions of events between Hedvigs iOS and Android apps.

### Defintion structure

Each event defines the following fields:

	- name: the event name to be sent to the analytics provider
	- accessor: the name of the accessor function that gets codegenerated
	- inputs:
		- name: the name of the input to be sent to the analytics provider
		- type: the type of the input (String, Bool, Int, Double, Float)
		- argument: the name of the argument that gets codegenerated