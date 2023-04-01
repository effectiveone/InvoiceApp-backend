function extractYearAndMonth(
  invoices,
  prefixes,
  selectedYear = null,
  selectedMonth = null
) {
  const regex = new RegExp(`(${prefixes.join("|")})(\\d{2})(\\d{2})`, "g");
  const results = invoices.reduce((acc, invoice) => {
    const { invoiceNumber } = invoice;
    let match;

    while ((match = regex.exec(invoiceNumber)) !== null) {
      const [_, prefix, year, month] = match;

      const invoiceData = {
        numerFaktury: invoice.invoiceNumber,
        dataWplywu: invoice.invoicePaymentDate,
        dataZakupu: invoice.invoiceSaleDate,
        wartoscNetto: invoice.totalNetValue,
        wartoscBrutto: invoice.totalGrossValue,
        kwotaVAT: invoice.totalGrossValue,
        selectedKontrahentName: invoice.selectedKontrahent,
        selectedKontrahentLegal: invoice.selectedKontrahent.legalForm,
        selectedKontrahentNip: invoice.selectedKontrahent.nip,
      };

      acc[year] = acc[year] || {};
      acc[year][month] = acc[year][month] || {};

      if (["FV", "FPS", "K-", "FZL"].includes(prefix)) {
        acc[year][month]["sprzedazowa"] = [
          ...(acc[year][month]["sprzedazowa"] || []),
          invoiceData,
        ];
      }

      if (["FZ", "FPZ"].includes(prefix)) {
        acc[year][month]["zakupowa"] = [
          ...(acc[year][month]["zakupowa"] || []),
          invoiceData,
        ];
      }
    }

    return acc;
  }, {});

  if (selectedYear !== null && selectedMonth !== null) {
    return {
      allInvoices: results,
      selectedYear: results[selectedYear][selectedMonth],
    };
  } else {
    return {
      allInvoices: results,
      selectedYear: null,
    };
  }
}

module.exports = { extractYearAndMonth };
