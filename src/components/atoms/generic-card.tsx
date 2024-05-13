import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type Props = {};

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
        <p className="text-xs text-muted-foreground">{subheading}</p>
      </CardContent>
    </Card>
  );
};

export default GenericCard;
