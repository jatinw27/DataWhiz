export function buildMongoQuery({
    table,
    columns,
    condition,
    intent,
    aggregation
}) {
    const query = {
        collection: table,
        filter: {},
        projection: {}
    };

    if (columns && columns.length) {
        columns.forEach(col => {
            query.projection[col] = 1;
        });
    }

    if(condition) {
        const [field, operator, value] = condition.split(" ");

        const numValue = Number(value);

        if(operator === ">") {
            query.filter[field] = { $gt: numValue};
        }else if (operator === "<") {
            query.filter[field] = { $lt: numValue};
        } else if (operator === "=") {
            query.filter[field] = numValue;
        }
    }

    // Aggregation
    if(aggregation) {
        const match = aggregation.match(/(AVG|MIN|MAX|SUM)\((.+)\)/i);

        if(match) {
            const func = match[1].toLowerCase();
            const field = match[2];

            query.aggregation = [
                {
                    $group: {
                        _id: null,
                        value: {
                            [`$${func}`]: `$${field}`

                        }
                    }
                }
            ];
        }
    }

    return query;
}