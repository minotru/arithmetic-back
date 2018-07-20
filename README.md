structure of GameMap is:
<pre>
{
    "topicName": {
        "levelName": {
            "operationType": {
                "number1": [
                    "range1",
                    "range2",
                    ...
                ]
                ...
            }
            ...
        }
        ...
    }
    ...
}
</pre>
operation type is one of: "+", "-", "*", "/"

where range is denoted in the following way:\
"number" - is a number\
"!number" - is not a number\
"number1-number2" - inside range [number1,number2]\
"!number1-number2" - not in range [number1, number2]
