const builder = require("xmlbuilder");

function generateJpkXml(selectedYearData) {
  const root = builder.create("JPK", { encoding: "UTF-8" });
  const jpkVat = root.ele("JPK_VAT", {
    xmlns: "http://jpk.mf.gov.pl/wzor/2019/05/03/05035/",
    xmlnsxsi: "http://www.w3.org/2001/XMLSchema-instance",
    xsiSchemaLocation:
      "http://jpk.mf.gov.pl/wzor/2019/05/03/05035/ JPK_VAT_1_1.xsd",
  });

  const naglowek = jpkVat.ele("Naglowek");
  naglowek.ele("KodFormularza", "JPK_VAT");
  naglowek.ele("WariantFormularza", "1");
  naglowek.ele("CelZlozenia", "1");
  naglowek.ele("DataWytworzeniaJPK", new Date().toISOString());
  naglowek.ele("DataOd", `${selectedYearData.selectedYear}-01-01`);
  naglowek.ele("DataDo", `${selectedYearData.selectedYear}-12-31`);
  naglowek.ele("DomyslnyKodWaluty", "PLN");

  const podmiot1 = jpkVat.ele("Podmiot1");
  podmiot1.ele("IdentyfikatorPodmiotu", "");
  podmiot1.ele("Nazwa", "");
  podmiot1.ele("NIP", "");
  podmiot1.ele("PelnaNazwa", "");
  podmiot1.ele("REGON", "");
  podmiot1.ele("KodKraju", "");
  podmiot1.ele("Wojewodztwo", "");
  podmiot1.ele("Powiat", "");
  podmiot1.ele("Gmina", "");
  podmiot1.ele("Ulica", "");
  podmiot1.ele("NrDomu", "");
  podmiot1.ele("NrLokalu", "");
  podmiot1.ele("Miejscowosc", "");
  podmiot1.ele("KodPocztowy", "");
  podmiot1.ele("Poczta", "");
  podmiot1.ele("Czestotliwosc", "");

  const sprzedazWiersz = jpkVat.ele("SprzedazWiersz");
  const zakupWiersz = jpkVat.ele("ZakupWiersz");

  selectedYearData.sprzedazowa.forEach((invoice) => {
    const invoiceWiersz = sprzedazWiersz.ele("SprzedazWiersz");
    invoiceWiersz.ele("LpSprzedazy").txt("");
    invoiceWiersz
      .ele("NrKontrahenta")
      .txt(invoice.selectedKontrahentNip || "BRAK");
    invoiceWiersz
      .ele("NazwaKontrahenta")
      .txt(invoice.selectedKontrahentName.companyName || "BRAK");
    invoiceWiersz;
    // .ele("AdresKontrahenta")
    // .txt(
    //   `${invoice.selectedKontrahentName.street || "BRAK"}``${
    //     invoice.selectedKontrahentName.zipCode || "BRAK"
    //   }``${invoice.selectedKontrahentName.city || "BRAK"}`
    // );
    invoiceWiersz.ele("DowodSprzedazy").txt(invoice.numerFaktury);
    invoiceWiersz
      .ele("DataWystawienia")
      .txt(new Date(invoice.dataZakupu).toISOString().slice(0, 10));
    invoiceWiersz
      .ele("DataSprzedazy")
      .txt(new Date(invoice.dataZakupu).toISOString().slice(0, 10));
    invoiceWiersz.ele("K_10").txt(invoice.wartoscNetto.toFixed(2));
    invoiceWiersz.ele("K_11").txt(invoice.kwotaVAT.toFixed(2));
    invoiceWiersz.ele("K_12").txt(invoice.wartoscBrutto.toFixed(2));
  });

  return root.end({ pretty: true });
}

module.exports = { generateJpkXml };
