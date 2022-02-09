plugins {
    `maven-publish`
    id("org.jetbrains.kotlin.jvm") version "1.5.31"
    `java-library`
    id("org.jlleitschuh.gradle.ktlint") version "10.2.1"
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
    withSourcesJar()
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }
}

sourceSets {
    main {
        java.srcDir("kotlin/src/main/kotlin")
    }
}

repositories {
    mavenCentral()
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            groupId = "com.hedvig.hanalytics"
            artifactId = "hanalytics"
            version = "0.0.1"

            from(components["java"])
        }
    }
}
