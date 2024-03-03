import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableInformation = (props: any) => {
  const { data, tableHeader } = props;
  const { document: documents } = data;

  return (
    <>
      <Table className=" m-5">
        <TableHeader>
          <TableRow>
            {tableHeader?.map((h: any, i: number) => (
              <TableHead key={i} className={`${h?.styles}`}>
                {h.headerName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableBody className=" overflow-hidden">
          <>
            {documents
              ? documents.map((d: any, i: number) => (
                  <TableRow key={i} className=" text-center">
                    <TableCell>{i}</TableCell>
                    <TableCell>{d.operationFlag}</TableCell>
                    <TableCell>{d.docNo}</TableCell>
                    <TableCell className="text-right">
                      {d.grandTotalAmount}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </>
        </TableBody>
      </Table>
    </>
  );
};

export default TableInformation;
