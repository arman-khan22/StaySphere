const Listing = require("../models/listing.js");
const axios = require('axios');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {

    // Geocoding
   let location = req.body.listing.location;
   async function geocodeAddress(location) {

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    try {
        const response = await axios.get(url);
        const data = await response.data;

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
            return null; // No address found
        }
    } catch (error) {
        console.error('Error with geocoding:', error);
        return null;
    }
}

// Perform geocoding to get coordinates
const coordinates = await geocodeAddress(location);

    if (!coordinates) {
        req.flash("error", "Invalid location provided!");
        return res.redirect("/listings/new");
    }

    let coor = [coordinates.lon, coordinates.lat];

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: 'Point',           // GeoJSON type must be 'Point'
        coordinates: coor        // Store in the geometry field
    };
    await newListing.save();
    console.log(newListing);

    req.flash("success", "New listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("successdel", "Listing Deleted!");
    res.redirect("/listings");
};