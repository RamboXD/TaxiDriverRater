import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'http://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 70,
    paddingRight: 70,
    flexDirection: 'column',
    fontFamily: 'Roboto',
    fontSize: 10,
    gap: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const generateOrderPDFDocument = async (invoiceData: any) => {
  const blob = await pdf(
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Image
              src='/images/logo/logo.jpg'
              style={{ width: 60, height: 60 }}
            />
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ fontWeight: 'bold' }}>
                {invoiceData.grossMarket.name}
              </Text>
              <Text>
                {`${invoiceData.grossMarket.address?.country} ${invoiceData.grossMarket.address?.city} ${invoiceData.grossMarket.address?.street}`}
              </Text>
              <Text>{invoiceData.grossMarket.address?.postalCode}</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
            }}
          >
            <Text
              style={{ fontWeight: 'bold', textAlign: 'right', width: 100 }}
            >
              Invoice #7777
            </Text>
            <Text
              style={{ fontWeight: 'bold', textAlign: 'right', width: 100 }}
            >
              Issue date
            </Text>
            <Text style={{ textAlign: 'right', width: 100 }}>
              {dayjs(Date.now()).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
        <View style={{ border: 0.5 }}></View>
        <View style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Text style={{ fontSize: 25 }}>{invoiceData.grossMarket.name}</Text>
          <Text style={{ fontSize: 10 }}>Invoice for daily orders.</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: 1,
              paddingTop: 10,
              width: '30%',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>BILL TO</Text>
            <Text>{invoiceData.billTo.company.name}</Text>
            <Text>{invoiceData.billTo.company.email}</Text>
            <Text>{invoiceData.billTo.company.phone}</Text>
            <Text>
              {`${invoiceData.billTo.address.country} ${invoiceData.billTo.address.city} ${invoiceData.billTo.address.street}`}
            </Text>
            <Text>{invoiceData.billTo.address.postalCode}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: 1,
              paddingTop: 10,
              width: '30%',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>DETAILS</Text>
            <Text>{invoiceData.details}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: 1,
              textAlign: 'right',
              paddingTop: 10,
              width: '30%',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>PAYMENT</Text>
            <Text>
              {dayjs(invoiceData.payment.dueDate).format('DD/MM/YYYY')}
            </Text>
            <Text>${invoiceData.payment.amount}</Text>
          </View>
        </View>
        <View style={{ border: 0.5 }}></View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 11 }}>ITEM</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: 11,
              }}
            >
              QTY
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: 11,
              }}
            >
              RATE
            </Text>
            <Text
              style={{
                width: 100,
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: 11,
              }}
            >
              AMOUNT
            </Text>
          </View>
        </View>
        <View style={{ border: 0.5 }}></View>
        {invoiceData.invoiceItems.map((orderItem: any, i: number) => (
          <View
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text>{orderItem.productName}</Text>
              <Text>{orderItem.sortName}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ width: 100, textAlign: 'right' }}>
                {orderItem.volume}
              </Text>
              <Text style={{ width: 100, textAlign: 'right' }}>
                ${orderItem.rate}
              </Text>
              <Text style={{ width: 100, textAlign: 'right' }}>
                ${orderItem.totalPrice}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ border: 0.5 }}></View>
        <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Text>Subtotal</Text>
            <Text>${invoiceData.payment.amount}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Text>Tax</Text>
            <Text>$0.00</Text>
          </View>
          <View style={{ border: 0.5 }}></View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <Text>Total Due</Text>
            <Text>${invoiceData.payment.amount}</Text>
          </View>
        </View>
      </Page>
    </Document>,
  ).toBlob();

  saveAs(blob, 'pageName');
};

export default generateOrderPDFDocument;
