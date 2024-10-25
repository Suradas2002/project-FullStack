import { ErrorComponent, Refine } from "@refinedev/core";
import {  DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/layout";
import Homepage from "./pages/homepage";
import Service from "./pages/service";
import Login from "./pages/login";
import Adminpage from "./pages/adminpage";
import { useState } from "react";
import Register from "./pages/register";
import Createcar from "./pages/admin/createcar";
import Rentalreport from "./pages/admin/rentalreport";
import Setcar from "./pages/admin/setcar";
import Bookingpage from "./pages/bookingpage";
import PaymentPage from "./pages/paymentpage"
import CheckoutPage from "./pages/checkoutpage";
function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleLogin = (loggedIn: boolean, isAdmin: boolean) => {
    setLoggedIn(loggedIn);
    setIsAdmin(isAdmin);
  };
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider("http://localhost:8080/api/v1/")}
            routerProvider={routerBindings}
            resources={[
              {
                name: "homepage",
                list: "/homepage",         
              },
              {
                name: "about",
                list: "/about",
              },
              {
                name: "performance",
                list: "/performance",             
              },
              {
                name: "contact",
                list: "/contact",
              },
              {
                name: "service",
                list: "/service",
              },
              {
                name: "login",
                list: "/login",
              },
              {
                name: "register",
                list: "/register",
              },
              {
                name: "adminpage",
                list: "/adminpage",
              },
              {
                name:"/adminpage/createcar"
              },
              {
                name:"/adminpage/setcar"
              },
              {
                name:"/adminpage/rentalreport"
              },
              {
                name:"/service/bookingpage"
              },
               {
                name:"/service/paymentpage"
              },
              {
                name:"/service/checkoutpage"
              },  
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "S42fKY-xseczw-nckVtA",
            }}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="homepage" />}
                />
                <Route path="/homepage">           
                  <Route index element={<Homepage />} />
                </Route>
                <Route path="/service">              
                  <Route index element={<Service/>} />
                  <Route path="bookingpage" element={<Bookingpage/>} />
                  <Route path="paymentpage" element={<PaymentPage/>} />
                  <Route path="checkoutpage" element={<CheckoutPage/>} />
                </Route>
                <Route path="/login">          
                  <Route index element={<Login />} />
                </Route>
                <Route path="/register">
                  <Route index element={<Register />} />
                </Route>
                <Route path="/adminpage" element={<Adminpage />}>
                  <Route index element={<Createcar />} />
                  <Route path="createcar" element={<Createcar />} />
                  <Route path="setcar" element={<Setcar />} />
                  <Route path="rentalreport" element={<Rentalreport />} />
                </Route>
                <Route path="/CategoryList">
                  {/* <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} /> */}
                </Route>

                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
