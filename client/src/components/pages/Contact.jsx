import React from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaPaperclip,
  FaCommentDots,
} from "react-icons/fa";

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-base-300 min-h-screen flex items-center justify-center py-10 px-5">
      <div className="bg-base-100 shadow-xl p-10 rounded-lg max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-semibold">Full Name</label>
            <div className="flex items-center border p-2 rounded-md">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                className="w-full outline-none"
                placeholder="Your Name"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-semibold">Email Address</label>
            <div className="flex items-center border p-2 rounded-md">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full outline-none"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number (Optional) */}
          <div>
            <label className="block font-semibold">
              Phone Number (Optional)
            </label>
            <div className="flex items-center border p-2 rounded-md">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="tel"
                {...register("phone")}
                className="w-full outline-none"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-semibold">Subject</label>
            <input
              type="text"
              {...register("subject", { required: "Subject is required" })}
              className="w-full border p-2 rounded-md outline-none"
              placeholder="Subject"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block font-semibold">Category</label>
            <select
              {...register("category", {
                required: "Please select a category",
              })}
              className="w-full border p-2 rounded-md outline-none"
            >
              <option value="">Select a category</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold">Message</label>
            <div className="flex items-start border p-2 rounded-md">
              <FaCommentDots className="text-gray-500 mr-2 mt-1" />
              <textarea
                {...register("message", { required: "Message is required" })}
                className="w-full outline-none resize-none"
                rows="4"
                placeholder="Your message..."
              ></textarea>
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          {/* Attachment Upload */}
          <div>
            <label className="block font-semibold">Attachment (Optional)</label>
            <div className="flex items-center border p-2 rounded-md">
              <FaPaperclip className="text-gray-500 mr-2" />
              <input
                type="file"
                {...register("attachment")}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
