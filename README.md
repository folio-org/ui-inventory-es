# ui-inventory-es

Copyright (C) 2017-2021 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## DEPRECATED

After the functionality of this proof of concept has been moved into <https://github.com/folio-org/ui-inventory>
it is no longer needed and has been archived.

## Introduction

This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module which is the cope of ui-inventory for the ElasticSearch POC.

## How the UI parses user input before submitting to API

UI provides autosuggestion for search options, operators and boolean operators.

The APIs support CQL, and the UI parses the query entered into the search field into CQL.
However, users must adhere to the following structures:
1. `search option` `operator` `term` e.g.`"Title (all)"` `=` `Boston`
2. `search option` `operator` `term` `boolean operator` `search option` `operator` `term` ... e.g. `"Title (all)"` `=` `Boston` `or` `Title (all)` `=` `"Los Angeles"` ...
3. `search option` `operator` `(term` `boolean operator` `term)` e.g. `"Title (all)"` `=` `(Boston` `or` `"Los Angeles")`
4. `search option` `operator` `(term` `boolean operator` `term` `boolean operator` `term` ...`)` e.g. `"Title (all)"` `=` `(Boston` `or` `Monaco` `or` `"San Francisco"` ... `)`

Examples of parsed queries before submitting to API:
1. `"Title (all)" = Boston` is parsed in `title all "Boston"`
2. `"Title (all)" = Boston or "Title (all)" = "Los Angeles"` is parsed in `title all "Boston" OR title all "Los Angeles"`
3. `"Title (all)" = (Boston or "Los Angeles")` is parsed in `title all "Boston" OR title all "Los Angeles"`
4. `"Title (all)" = (Boston or Monaco or "San Francisco")` is parsed in `(title all "Boston" OR title all "Monaco") OR title all "San Francisco"`

We need to hit the `Enter` button to confirm each element of the structure. However, we can
also confirm the `search option`, `operator` and `boolean operator` using the `space` button.

When we use parentheses, our term contains a `boolean operator`, and we need to hit
the `Enter` button for each part of the `term`. For example, `"Title (all)"` `=` `(Boston` `or` `Monaco)`
we need to hit the `Enter` button for `(Boston`, `or` and `Monaco)` are required.

When the entered element is URL or contains two or more words, it is automatically quoted.

When we need to edit several words in a term, we must press the `Enter` button after editing
each word, in this case, the quotes are pasted automatically. Otherwise, we can first edit
all the words in the term by adding quotes ourselves where needed, and then press the enter
button once.

### Supported search options for *instances*:

Search option | Search option CQL
------------- | -----------------
Title (all) | title all
Contributor | contributors=
Identifier (all) | identifiers.value==
ISSN | issn==
ISBN | isbn==
Subject | subjects all
Instance UUID | id==
Instance HRID | hrid==
Electronic access all fields | electronicAccess==
Electronic access - URI | electronicAccess.uri==
Electronic access - Public note | electronicAccess.publicNote all
Electronic access - Link Text | electronicAccess.linkText all
Electronic access - Materials Specified | electronicAccess.materialsSpecification all

### Supported search options for *holdings*:

Search option | Search option CQL
------------- | -----------------
ISSN | issn==
ISBN | isbn==
Call number | holdings.fullCallNumber==
Holdings HRID | holdings.hrid==
Electronic access all fields | electronicAccess==
Electronic access - URI | electronicAccess.uri==
Electronic access - Public note | electronicAccess.publicNote all
Electronic access - Link Text | electronicAccess.linkText all
Electronic access - Materials Specified | electronicAccess.materialsSpecification all

### Supported search options for *item*:

Search option | Search option CQL
------------- | -----------------
Barcode | items.barcode==
ISSN | issn==
ISBN | isbn==
Call number | items.effectiveCallNumberComponents==
Item HRID | items.hrid==
Electronic access all fields | electronicAccess==
Electronic access - URI | electronicAccess.uri==
Electronic access - Public note | electronicAccess.publicNote all
Electronic access - Link Text | electronicAccess.linkText all
Electronic access - Materials Specified | electronicAccess.materialsSpecification all

When the search field is empty, and the user enters text that is not one of the suggested
in the dropdown list, then the search will be performed by `keyword all` search option.

### Supported operators:

Operator | Operator CQL
-------- | ------------
= | it is not added to CQL query

### Supported boolean operators:

Boolean operator | Boolean operator CQL
---------------- | --------------------
or | OR
and | AND
not | NOT

## Additional information

See the related [ui-users](https://github.com/folio-org/ui-users) module.

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UIIN](https://issues.folio.org/browse/UIIN)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
