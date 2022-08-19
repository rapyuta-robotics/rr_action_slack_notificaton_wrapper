Slack template file fixer action
================================

## 1. Description

This action is a workaround for this [open issue](https://github.com/slackapi/slack-github-action/issues/84) in the [slack-github-action](https://github.com/slackapi/slack-github-action), specifically when expanding context related variables in a template file.

### 1.1 Inputs (all mandatory)

Name|Description
-|-
`template-input-path`|Path to JSON-formatted template file to fix
`template-output-path`|Path to write the fixed template file
`replacements`|A set of ad-hoc replacements for the template check [here](#13-replacements-explanation)

### 1.2 Outputs

Name|Description
-|-|
`template-output-path`|Re-exported path of the fixed template

### 1.3 Replacements explanation

> :memo: **Note:** Github expressions can be used in every line of the replacements input

Given the following workflow step:

``` yaml
- name: awesome
  uses: Nunuzac/my-action@master
  with:
    template-input-path: resources/examples.json
    template-output-path: resources/example_fixed.json
    replacements: |
      NOTIFICATION_HEADER=":warning: Failed"
      NOTIFICATION_FOOTER="See <www.example.com>"
      WRONG=See <www.example.com>
```

This action will perfom the following steps:

1. Take every **new line** under `ad-hoc-replacements` as a potential replacement in the template, in this case there will be 3 potential replacements.
2. Validate each potential candidate according to `/(.+?)="(.+?)"/`, if it doesn't match the regex, it will be skipped; in this case `WRONG=See <www.example.com>` will be discarded as it is missing the quotation marks.
3. Every ocurrence of the first capture group preceeded by a percentage sign present in the template will be repaced by the second capture group, that is, every ocurrence of `%NOTIFICATION_HEADER` in the template will be replaced by `:warning: Failed`, and likewise ocurrences of `%NOTIFICATION_FOOTER` will be replaced by `See <www.example.com>`.