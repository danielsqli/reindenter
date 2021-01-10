This is an app that will reformat code

## Current Options

Can set to use either tabs or spaces, and how many to use per indent

## Features

Will add newlines and indents wherever necessary, as long as the code is in a c-style syntax

## Usage

App can be used with the web app at reindenter.vercel.app or with a POST request to https://reindenter.danielsqli.com/api/indent

The body must be in the form

```
{
    "code": "Your code here",
    "indents": "tabs | spaces"
    "size": "number of tabs/spaces per indent"
}
```
