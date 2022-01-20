import { Octokit } from "@octokit/core";
import React, { useEffect, useState } from "react"

const octokit = new Octokit({})

export const GithubStatus = (props) => {
    const [integrated, setIntegrated] = useState(null)

    useEffect(async () => {
        const result = await octokit.request('GET /search/code', {
            q: props.query
        })

        setIntegrated(result.data.total_count > 0)
    }, [])

    if (integrated !== null) {
        return <p>{integrated ? "Yes" : "No" }</p>
    }

  return <p>Loading...</p>
}