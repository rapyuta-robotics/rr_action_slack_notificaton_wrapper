Slack template file fixer action
================================

## 1. Description

This action is a workaround for this [open issue](https://github.com/slackapi/slack-github-action/issues/84) in the [slack-github-action](https://github.com/slackapi/slack-github-action), specifically when expanding context related variables in a template file.

### 1.1 Inputs

|Name|Description|Optional
-|-|-
`payload-file-path`|Path to JSON-formatted template file to fix|:heavy_check_mark: *
`payload`|JSON string template file to fix|:heavy_check_mark: *
`replacements`|Ad-hoc replacements to perform on the `payload-file-path`; see [Ad-hoc replacements](#12-ad-hoc-replacements)|:heavy_check_mark:
`channel-id`|Slack channel to send the message to|:x:
`slack-bot-token`|Access token to the Slack API|:x:

> ### :memo: **Note:**
> Either `payload` or `payload-file-path` must be provided, the step will fail if none is provided.

### 1.2 Ad-hoc replacements

Given the following workflow step:

``` yaml
    name: Send notifications
    uses: rapyuta-robotics/rr_action_slack_notification_wrapper@1.1.0
    with:
      payload-file-path: ./failure_notification.json
      replacements: |
        NOTIFICATION_HEADER=":warning: Failed ${{ github.sha }}"
        NOTIFICATION_FOOTER="See <www.example.com>"
        WRONG=This will not be replaced
      channel-id: ABCDFG
      slack-bot-token: ${{ secrets.SLACK_NOTIFICATIONS_APP_TOKEN }}

```

> ### :memo: **Note:**
> The input `replacements` may use any valid github action expression and it will be expanded to its corresponding valur before running the action; in this example, `${{ github.sha }}`
> will be replaced by the commit sha before running e.g. `1a6184908f91b86ba226f4436a7b0323fbc2820b`

This action will perfom the following steps:

1. Take every **new line** under `ad-hoc-replacements` as a potential replacement in the template, in this case there will be 3 potential replacements.
2. Validate each potential candidate according to `/(.+?)="(.+?)"/`, if it doesn't match the regex, it will be skipped; in this case `WRONG=This will not be replaced` will be discarded as it is missing the quotation marks.
3. Every ocurrence of the first capture group preceeded by a percentage sign present in the template will be repaced by the second capture group, that is, every ocurrence of `%NOTIFICATION_HEADER` in the template will be replaced by `:warning: Failed 1a6184908f91b86ba226f4436a7b0323fbc2820b`, and likewise ocurrences of `%NOTIFICATION_FOOTER` will be replaced by `See <www.example.com>`.