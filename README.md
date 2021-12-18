## hAnalytics

This repo contains shared analytics definitions of events between Hedvigs iOS and Android apps.

### Defintion structure

Each event defines the following fields:

	- name: the event name to be sent to the analytics provider
    - description: description of what the event is for
	- accessor: the name of the accessor function that gets codegenerated
	- inputs:
		- name: the name of the input to be sent to the analytics provider
		- type: the type of the input (String, Bool, Int, Double, Float)
		- argument: the name of the argument that gets codegenerated
    - graphql: (optional) perform a fetch against the graphql schema and populate the event with the returned data
        query: |
            query GraphQLQuery($INPUT_VARIABLE_NAME: Type!) {
                someField(input: $INPUT_VARIABLE_NAME)
                member {
                    firstName
                }
            }
        variables: (optional)
            - INPUT_VARIABLE_NAME
        getters:
            - name: FIRST_NAME
              getter: member.firstName (DeepFind similar to lodash._get)

### Build

`sh compile.sh`