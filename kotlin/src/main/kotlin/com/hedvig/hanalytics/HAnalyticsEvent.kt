package com.hedvig.hanalytics

data class HAnalyticsEvent(
    val name: String,
    val properties: Map<String, Any?>,
    val graphql: Map<String, Any?>? = null,
)
