import React from "react";
import Card from "../../../shared/components/Card";

export default function AlimentacionCard(title = "", text = "",children) {
    return (
        <Card title={title}>
            <hr />
            <Text>{text}</Text>
            <hr />
            {children}
        </Card>
    );
}