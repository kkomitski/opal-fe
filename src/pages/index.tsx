import Link from "next/link";
import { Activity, CircleUser, CreditCard, Menu, Package2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import CandlestickBlock from "@/components/molecules/kline-block";
import SearchInstruments from "@/components/molecules/search-intstruments";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AveragePriceCard from "@/components/atoms/average-price-card";
import GenericCard from "@/components/atoms/generic-card";
import SkeletonCard from "@/components/atoms/skeleton-card";
import TradesCard from "@/components/atoms/trades-card";
import InstrumentCardCollection from "@/components/molecules/instrument-cards-collection";

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export const iframeHeight = "825px";

export const containerClassName = "w-full h-full";

export default function Dashboard() {
  const { asPath } = useRouter();
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(asPath.substring(1));
    const symbolParam = searchParams.get("symbol");

    if (symbolParam) {
      setSymbol(symbolParam);
    }
  }, [asPath, symbol]);

  // return (
  //   <>
  //     <CandlestickBlock
  //       symbol={symbol}
  //       className="col-span-2 flex flex-col justify-between"
  //       chartOptions={{
  //         yLabel: "↑ Price ($)",
  //         xLabel: "Time",
  //       }}
  //     />
  //   </>
  // );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/#" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-3">
            <Image src="/onyx-logo.svg" width="500" height="400" alt="logo" className="max-w-[110px]" />
          </Link>
          <Link href="/#" className="text-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/#" className="text-muted-foreground transition-colors hover:text-foreground">
            Orders
          </Link>
          <Link href="/#" className="text-muted-foreground transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/#" className="text-muted-foreground transition-colors hover:text-foreground">
            Analytics
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/#" className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Onyx</span>
              </Link>
              <Link href="/#" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/#" className="text-muted-foreground hover:text-foreground">
                Orders
              </Link>
              <Link href="/#" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link href="/#" className="text-muted-foreground hover:text-foreground">
                Customers
              </Link>
              <Link href="/#" className="text-muted-foreground hover:text-foreground">
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <SearchInstruments />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="bg-slate-300 hidden">
          <p className="py-0 px-0 text-background">background</p>
          <p className="py-0 px-0 text-foreground">foreground</p>
          <p className="py-0 px-0 text-card">card</p>
          <p className="py-0 px-0 text-card-foreground">card-foreground</p>
          <p className="py-0 px-0 text-popover">popover</p>
          <p className="py-0 px-0 text-popover-foreground">popover-foreground</p>
          <p className="py-0 px-0 text-primary">primary</p>
          <p className="py-0 px-0 text-primary-foreground">primary-foreground</p>
          <p className="py-0 px-0 text-secondary">secondary</p>
          <p className="py-0 px-0 text-secondary-foreground">secondary-foreground</p>
          <p className="py-0 px-0 text-muted">muted</p>
          <p className="py-0 px-0 text-muted-foreground">muted-foreground</p>
          <p className="py-0 px-0 text-accent">accent</p>
          <p className="py-0 px-0 text-accent-foreground">accent-foreground</p>
          <p className="py-0 px-0 text-destructive">destructive</p>
          <p className="py-0 px-0 text-constructive">constructive</p>
          <p className="py-0 px-0 text-destructive-foreground">destructive-foreground</p>
          <p className="py-0 px-0 text-border">border</p>
          <p className="py-0 px-0 text-input">input</p>
          <p className="py-0 px-0 text-ring">ring</p>
        </div>

        <InstrumentCardCollection symbol={symbol} />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <CandlestickBlock
            // title={title} //
            symbol={symbol}
            className="col-span-2 flex flex-col justify-between"
            // data={data}
            chartOptions={{
              yLabel: "↑ Price ($)",
              xLabel: "Time",
            }}
          />
          {/* <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Recent transactions from your store.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden xl:table-column">Type</TableHead>
                    <TableHead className="hidden xl:table-column">Status</TableHead>
                    <TableHead className="hidden xl:table-column">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Liam Johnson</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">Sale</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-23</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Olivia Smith</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">Refund</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Declined
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-24</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Noah Williams</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">Subscription</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-25</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Emma Brown</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">Sale</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-26</TableCell>
                    <TableCell className="text-right">$450.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Liam Johnson</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                    </TableCell>
                    <TableCell className="hidden xl:table-column">Sale</TableCell>
                    <TableCell className="hidden xl:table-column">
                      <Badge className="text-xs" variant="outline">
                        Approved
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">2023-06-27</TableCell>
                    <TableCell className="text-right">$550.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}
          <TradesCard symbol={symbol} />
        </div>
      </main>
    </div>
  );
}
