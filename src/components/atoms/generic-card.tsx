import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

// FIXME: add prop types
const GenericCard = ({ title, heading, subheading, icon }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{heading}</div>
        <div className="text-xs text-muted-foreground">{subheading}</div>
      </CardContent>
    </Card>
  );
};

export default GenericCard;