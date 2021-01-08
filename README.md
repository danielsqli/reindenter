This is an app that will reindent code blocks

## Current Options

Can set to use either tabs or spaces, and how many to use per indent

## Features
Will remove excess indents, and add them when necessary.

## Requirements

The app assumes that the language used uses `{}` to separate code, and that extra whitespace is ignored 

## Usage

App can be used with the UI at reindenter.vercel.app or with a POST request to reindenter.vercel.app/api/indent

The body must be in form 

```
{
    "code": "Your code here",
    "indents": "tabs | spaces"
    "size": "number of tabs/spaces per indent"
}
```
